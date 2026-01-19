import { createAdminClient } from "@/lib/supabase/admin";
import { cacheLife, cacheTag } from "next/cache";

export async function getAdminMetrics() {
  "use cache";
  cacheLife('days')
  cacheTag('admin-metrics')
  const supabase = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalImages },
    { count: activeSubscriptions },
    { data: recentActivity },
  ] = await Promise.all([
    supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active"),
    supabase
      .from("images")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalImages: totalImages || 0,
    activeSubscriptions: activeSubscriptions || 0,
    lastActivity: recentActivity?.[0]?.created_at || null,
  };
}

export async function getUsageStats() {
  "use cache";
  cacheLife('days')
  cacheTag('usage-stats')
  try {
    const supabase = createAdminClient();

    // Fetch last 30 days of image generation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("images")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching usage stats:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    // Process data for chart
    const statsMap = new Map();
    data.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString();
      statsMap.set(date, (statsMap.get(date) || 0) + 1);
    });

    return Array.from(statsMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  } catch (error: any) {
    // Handle AbortError and other errors gracefully
    console.error("Error fetching usage stats:", {
      message: error?.message || 'Unknown error',
      details: error?.details || error?.stack || '',
      hint: error?.hint || '',
      code: error?.code || ''
    });
    return [];
  }
}

export async function getUsers() {
  const supabase = createAdminClient();

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  // Fetch subscription status for all users
  const { data: subscriptions } = await supabase
    .from("user_subscriptions")
    .select("*");

  return users.map((user) => {
    const sub = subscriptions?.find((s) => s.user_id === user.id);
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      plan_type: sub?.plan_type || "free",
      subscription_status: sub?.subscription_status || "inactive",
    };
  });
}

export async function getSubscriptionDetails() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }

  return data;
}

export async function getOperators() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('operators')
    .select(`
      id,
      auth_user_id,
      is_active,
      created_at,
      app_roles (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching operators:", error);
    return [];
  }

  // Fetch auth user details for emails
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching auth users for operators:", authError);
    return data.map(op => ({
      ...op,
      email: 'Unknown',
      role: (op.app_roles as any)?.name || 'Unknown'
    }));
  }

  return data.map(op => {
    const authUser = users.find(u => u.id === op.auth_user_id);
    return {
      ...op,
      email: authUser?.email || 'Unknown',
      role: (op.app_roles as any)?.name || 'Unknown'
    };
  });
}

export async function getRoles() {
  "use cache";
  cacheLife('days')
  cacheTag('roles')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('app_roles')
      .select(`
        id,
      name,
      role_permissions (
        permission_id
      )
    `)
      .order('name');

    if (error) {
      console.error("Error fetching roles:", error);
      return [];
    }

    // Transform data to flat structure
    return data.map((role: any) => ({
      id: role.id,
      name: role.name,
      assignedPermissionIds: role.role_permissions ? role.role_permissions.map((rp: any) => rp.permission_id) : [],
    }));
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function getAuditLogs() {
  "use cache";
  cacheLife('weeks')
  cacheTag('audit-logs')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}

export async function getPermissions() {
  "use cache";
  cacheLife('weeks')
  cacheTag('permissions')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('app_permissions').select('*');
    if (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
}

export async function getRolePermissions() {
  "use cache";
  cacheLife('days')
  cacheTag('role-permissions')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('role_permissions').select('*');
    if (error) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return [];
  }
}

export async function getOperatorPermissions() {
  "use cache";
  cacheLife('days')
  cacheTag('operator-permissions')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('operator_with_permissions').select('*');
    if (error) {
      console.error("Error fetching operator permissions:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching operator permissions:", error);
    return [];
  }
}

export async function getOperatorById(id: string) {
  "use cache";
  cacheLife('days')
  cacheTag('operator-permissions')
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('operator_with_permissions').select('*').eq('auth_user_id', id).single();
    if (error) {
      console.error("Error fetching operator permissions:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching operator permissions:", error);
    return [];
  }
}


