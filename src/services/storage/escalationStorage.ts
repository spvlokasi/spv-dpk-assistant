import { EscalationTicket } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const EscalationStorage = {
  getEscalations(branchId?: string): EscalationTicket[] {
    const raw = localStorage.getItem(KEYS.ESCALATIONS);
    let list = raw ? safeParse<EscalationTicket[]>(KEYS.ESCALATIONS, []) : [];
    list = list.filter((e) => !['esc-01', 'esc-02'].includes(e.id));
    if (branchId) return list.filter((e) => e.branchId === branchId);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  saveEscalations(list: EscalationTicket[]) {
    try {
      localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('saveEscalations error:', e);
    }
  },
  async saveEscalation(ticket: EscalationTicket) {
    const all = this.getEscalations();
    const index = all.findIndex((e) => e.id === ticket.id);
    if (index >= 0) all[index] = ticket;
    else all.unshift(ticket);
    this.saveEscalations(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('escalation_tickets').upsert({
          id: ticket.id,
          branch_id: ticket.branchId,
          branch_name: ticket.branchName,
          ticket_date: ticket.date,
          title: ticket.title,
          category: ticket.category,
          urgency: ticket.urgency,
          description: ticket.description,
          proposed_solution: ticket.proposedSolution || '',
          status: ticket.status,
          manager_feedback: ticket.managerFeedback || '',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync escalation failed:', e);
      }
    }
  },
  async deleteEscalation(id: string) {
    const all = this.getEscalations().filter((e) => e.id !== id);
    this.saveEscalations(all);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('escalation_tickets').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete escalation failed:', e);
      }
    }
  }
};
