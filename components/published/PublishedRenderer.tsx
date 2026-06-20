type Section = { id: string; type: string; props: Record<string, any>; animation?: Record<string, any>; metadata?: Record<string, any> };
type Product = { id: string; name: string; price: number; stock: number };
type Asset = { id: string; url: string; type: string; filename: string };

export function PublishedRenderer({ website, page, products, assets }: { website: any; page: { sections: Section[] }; products: Product[]; assets: Asset[] }) {
  return (
    <main className="min-h-screen bg-[#F8F6F0] text-[#1a1a1a]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F8F6F0]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <b className="tracking-tight">{website.name}</b>
          <a href="#contact" className="rounded-full bg-[#1a1a1a] px-5 py-2 text-sm font-bold text-white">Contact</a>
        </div>
      </header>
      {(page.sections || []).map((section) => <PublishedSection key={section.id} section={section} products={products} assets={assets} />)}
      <footer className="border-t border-black/10 px-5 py-10 text-center text-sm text-black/50">Published with Aurelia AI</footer>
    </main>
  );
}

function PublishedSection({ section, products, assets }: { section: Section; products: Product[]; assets: Asset[] }) {
  const p = section.props || {};
  if (section.type === "hero") {
    const heroImage = assets.find((asset) => asset.type.startsWith("image/"));
    return <section className="relative overflow-hidden px-5 py-24"><div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-2xl"/><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]"><div><span className="rounded-full border border-[#D4AF37]/30 bg-white/60 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#7a5b12]">{p.eyebrow || "Premium"}</span><h1 className="mt-6 font-serif text-6xl font-black leading-[.92] tracking-[-.06em] md:text-8xl">{p.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{p.body}</p><a href="#products" className="mt-8 inline-flex rounded-full bg-gradient-to-br from-[#D4AF37] to-[#92701c] px-6 py-3 font-bold text-white shadow-2xl">{p.cta || "Explore"}</a></div><div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 p-4 shadow-2xl">{heroImage ? <img src={heroImage.url} alt={heroImage.filename} className="h-[420px] w-full rounded-[1.5rem] object-cover"/> : <div className="h-[420px] rounded-[1.5rem] bg-gradient-to-br from-white via-[#eadfc9] to-[#D4AF37]"/>}</div></div></section>;
  }
  if (section.type === "features") return <section className="px-5 py-20"><div className="mx-auto max-w-7xl"><h2 className="font-serif text-5xl font-black tracking-[-.05em]">{p.title}</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{(p.items || []).map((item: any, i: number) => <div key={i} className="rounded-[2rem] border border-black/10 bg-white/60 p-7 shadow-xl backdrop-blur-xl"><b>{item.title}</b><p className="mt-3 leading-7 text-black/55">{item.body}</p></div>)}</div></div></section>;
  if (section.type === "gallery") return <section className="px-5 py-20"><div className="mx-auto max-w-7xl"><h2 className="font-serif text-5xl font-black tracking-[-.05em]">{p.title}</h2><div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">{[0,1,2].map((i) => <div key={i} className="h-72 rounded-[2rem] bg-gradient-to-br from-white via-[#eadfc9] to-[#D4AF37] shadow-xl" />)}</div></div></section>;
  if (section.type === "products") return <section id="products" className="px-5 py-20"><div className="mx-auto max-w-7xl"><h2 className="font-serif text-5xl font-black tracking-[-.05em]">{p.title}</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{products.slice(0, p.limit || 3).map((product) => <article key={product.id} className="rounded-[2rem] border border-black/10 bg-white/70 p-5 shadow-xl"><div className="mb-5 h-44 rounded-[1.5rem] bg-gradient-to-br from-[#1a1a1a] to-[#D4AF37]"/><b>{product.name}</b><p className="mt-2 text-black/55">${(product.price / 100).toFixed(2)}</p><button className="mt-5 rounded-full border border-black/10 px-5 py-2 font-bold">Add to cart</button></article>)}</div></div></section>;
  if (section.type === "lead") return <section id="contact" className="px-5 py-20"><div className="mx-auto max-w-5xl rounded-[2rem] bg-[#1a1a1a] p-10 text-white"><h2 className="font-serif text-5xl font-black tracking-[-.05em]">{p.title}</h2><form className="mt-8 flex flex-col gap-3 md:flex-row"><input className="min-w-0 flex-1 rounded-full px-5 py-3 text-black" placeholder={p.placeholder || "email@brand.com"}/><button className="rounded-full bg-[#D4AF37] px-6 py-3 font-bold">Submit</button></form></div></section>;
  return null;
}
