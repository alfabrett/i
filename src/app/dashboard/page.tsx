async function getData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/dashboard`, { cache: 'no-store' });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getData();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4">
        {data.map((item: any) => (
          <article key={item.id} className="card">
            <h2 className="font-semibold">{item.titulo}</h2>
            <p className="text-sm text-slate-600">Solicitudes: {item.solicitudes} · Media: {item.media.toFixed(2)} · Estado: {item.estado}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
