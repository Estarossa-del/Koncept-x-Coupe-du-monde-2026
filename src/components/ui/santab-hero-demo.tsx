import SantabHero from "@/components/ui/santab-hero";

export default function SantabHeroDemo() {
  return (
    <div className="w-full">
      <SantabHero
        showCTA={true}
        showControls={true}
        title="SANTAB IA"
        subtitle="Le pronostiqueur ultime de la Coupe du Monde 2026"
        primaryCTA="Mes Pronostics"
        secondaryCTA="En savoir plus"
        onPrimaryClick={() => console.log('Pronostics clicked')}
        onSecondaryClick={() => console.log('En savoir plus clicked')}
      />
    </div>
  );
}
