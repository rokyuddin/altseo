# Container Queries Guide

This guide explains how to use container queries in this Next.js project with Tailwind CSS v4.

## What are Container Queries?

Container queries allow you to style elements based on the size of their **parent container** rather than the viewport size. This is perfect for creating truly reusable components that adapt to their context.

## Setup

Container queries are already configured in `src/styles/globals.css`. You can use them anywhere in your project!

## Basic Usage

### 1. Define a Container

First, mark an element as a container using one of these classes:

```tsx
// Basic inline-size container (most common)
<div className="container-inline-size">
  {/* Child elements can use container queries */}
</div>

// Size container (queries both width and height)
<div className="container-size">
  {/* Child elements can use container queries */}
</div>

// Normal container (resets container type)
<div className="container-normal">
  {/* No container queries */}
</div>
```

### 2. Use Container Query Variants

Apply styles based on container size using the `@` prefix:

```tsx
<div className="container-inline-size">
  <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
    {/* 1 column by default, 2 at @md, 3 at @lg */}
  </div>
</div>
```

## Available Breakpoints

| Variant | Min Width | Pixels |
|---------|-----------|--------|
| `@xs`   | 20rem     | 320px  |
| `@sm`   | 24rem     | 384px  |
| `@md`   | 28rem     | 448px  |
| `@lg`   | 32rem     | 512px  |
| `@xl`   | 36rem     | 576px  |
| `@2xl`  | 42rem     | 672px  |
| `@3xl`  | 48rem     | 768px  |
| `@4xl`  | 56rem     | 896px  |
| `@5xl`  | 64rem     | 1024px |
| `@6xl`  | 72rem     | 1152px |
| `@7xl`  | 80rem     | 1280px |

## Named Containers

For better organization, use pre-defined named containers:

```tsx
// Card container
<div className="container-card">
  <div className="p-4 @md:p-6 @lg:p-8">
    {/* Padding adapts to card size */}
  </div>
</div>

// Sidebar container
<div className="container-sidebar">
  <nav className="text-sm @lg:text-base">
    {/* Font size adapts to sidebar width */}
  </nav>
</div>

// Main content container
<div className="container-main">
  {/* Your main content */}
</div>

// Section container
<div className="container-section">
  {/* Your section content */}
</div>
```

## Real-World Examples

### Example 1: Responsive Card Component

```tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="container-card rounded-lg border bg-card p-4">
      {/* Stack on small containers, side-by-side on larger */}
      <div className="flex flex-col @md:flex-row gap-4">
        <img 
          src={product.image} 
          className="w-full @md:w-32 h-32 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-base @md:text-lg @lg:text-xl font-semibold">
            {product.name}
          </h3>
          <p className="text-sm @md:text-base text-muted-foreground">
            {product.description}
          </p>
          {/* Show price inline on larger containers */}
          <div className="mt-2 @lg:mt-0 @lg:inline-block">
            <span className="text-lg font-bold">${product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Example 2: Dashboard Widget

```tsx
export function StatsWidget({ title, value, trend }: StatsWidgetProps) {
  return (
    <div className="container-card rounded-xl bg-card p-4 @md:p-6">
      {/* Compact layout for small containers */}
      <div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
        <h3 className="text-sm @md:text-base font-medium text-muted-foreground">
          {title}
        </h3>
        {/* Hide trend indicator on very small containers */}
        <span className="hidden @sm:inline-flex items-center gap-1 text-xs">
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-2xl @md:text-3xl @lg:text-4xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
```

### Example 3: Sidebar Navigation

```tsx
export function Sidebar() {
  return (
    <aside className="container-sidebar w-64 @lg:w-80 bg-sidebar">
      <nav className="p-4">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
          >
            <item.icon className="w-5 h-5 @lg:w-6 @lg:h-6" />
            {/* Show full text only when sidebar is wide enough */}
            <span className="hidden @md:inline text-sm @lg:text-base">
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
```

### Example 4: Data Table

```tsx
export function DataTable({ data }: { data: TableData[] }) {
  return (
    <div className="container-main">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 @md:p-4">Name</th>
              {/* Hide less important columns on small containers */}
              <th className="hidden @lg:table-cell text-left p-2 @md:p-4">
                Email
              </th>
              <th className="hidden @xl:table-cell text-left p-2 @md:p-4">
                Phone
              </th>
              <th className="text-left p-2 @md:p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-2 @md:p-4 text-sm @md:text-base">
                  {row.name}
                </td>
                <td className="hidden @lg:table-cell p-2 @md:p-4 text-sm @md:text-base">
                  {row.email}
                </td>
                <td className="hidden @xl:table-cell p-2 @md:p-4 text-sm @md:text-base">
                  {row.phone}
                </td>
                <td className="p-2 @md:p-4">
                  <span className="text-xs @md:text-sm px-2 py-1 rounded-full bg-primary/10">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Container Queries vs Media Queries

### When to use Container Queries:
- ✅ Reusable components that appear in different contexts
- ✅ Cards, widgets, or modules that need to adapt to their container
- ✅ Components in sidebars, grids, or flexible layouts
- ✅ When component size is unpredictable

### When to use Media Queries (responsive variants):
- ✅ Page-level layouts
- ✅ Global navigation
- ✅ Viewport-dependent features
- ✅ When you need to respond to device characteristics

## Combining Container and Media Queries

You can use both together for maximum flexibility:

```tsx
<div className="container-card">
  {/* Responsive at viewport level */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Each card adapts to its container */}
    <div className="p-4 @md:p-6 @lg:p-8">
      <h3 className="text-base @lg:text-xl">Card Title</h3>
    </div>
  </div>
</div>
```

## Tips and Best Practices

1. **Start with `container-inline-size`**: It's the most common and performant option.

2. **Use named containers**: They make your code more semantic and easier to maintain.

3. **Progressive enhancement**: Design for the smallest container first, then add larger breakpoints.

4. **Test in different contexts**: Place your components in narrow and wide containers to ensure they work everywhere.

5. **Combine with utility classes**: Container queries work with all Tailwind utilities (padding, margin, colors, etc.).

6. **Performance**: Container queries are highly performant in modern browsers.

## Browser Support

Container queries are supported in all modern browsers:
- Chrome 105+
- Safari 16+
- Firefox 110+
- Edge 105+

For older browsers, styles will gracefully fall back to the base (non-container-query) styles.

## Troubleshooting

### Container queries not working?

1. **Check the parent**: Make sure you've added a container class to the parent element.
2. **Use `@` prefix**: Container query variants use `@md:`, not `md:`.
3. **Check nesting**: Container queries work on direct and nested children.
4. **Inspect in DevTools**: Use browser DevTools to see computed container sizes.

### Conflicts with responsive variants?

Container queries (`@md:`) and responsive variants (`md:`) can coexist. Just be mindful of specificity and order.

## Additional Resources

- [Tailwind CSS Container Queries Docs](https://tailwindcss.com/docs/responsive-design#container-queries)
- [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Can I Use - Container Queries](https://caniuse.com/css-container-queries)
