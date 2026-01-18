import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminMetrics() {
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
    console.error("Error fetching usage stats:", error);
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
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('app_roles').select('id, name');
  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
  return data;
}
