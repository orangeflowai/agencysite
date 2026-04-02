import { supabaseAdmin } from './supabaseAdmin';

export type AuditAction = 
  | 'booking_created'
  | 'booking_updated'
  | 'booking_cancelled'
  | 'refund_issued'
  | 'inventory_updated'
  | 'tour_created'
  | 'tour_updated'
  | 'tour_deleted'
  | 'admin_login'
  | 'admin_logout'
  | 'settings_updated';

export interface AuditLogEntry {
  id?: string;
  user_id: string;
  user_email: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

/**
 * Log an admin action for audit purposes
 */
export async function logAuditAction(
  userId: string,
  userEmail: string,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  details: Record<string, any> = {},
  req?: Request
): Promise<void> {
  try {
    const entry: Omit<AuditLogEntry, 'id' | 'created_at'> = {
      user_id: userId,
      user_email: userEmail,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: req ? getClientIp(req) : undefined,
      user_agent: req ? req.headers.get('user-agent') || undefined : undefined,
    };

    await supabaseAdmin.from('audit_logs').insert(entry);
  } catch (error) {
    // Log to console as fallback - consider using a proper logging service
    console.error('Failed to write audit log:', error);
    console.error('Audit entry:', { userId, action, resourceType, resourceId });
  }
}

/**
 * Get recent audit logs for the admin panel
 */
export async function getAuditLogs(
  limit: number = 100,
  offset: number = 0,
  filters?: {
    userId?: string;
    action?: AuditAction;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data || [];
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}
