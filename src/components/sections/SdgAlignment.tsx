import { SectionHeader } from "@/components/ui/SectionHeader";

const sdgs = [
  { number: "01", title: "No Poverty", color: "#E5243B" },
  { number: "03", title: "Good Health and Well-being", color: "#4C9F38" },
  { number: "04", title: "Quality Education", color: "#C5192D" },
  { number: "05", title: "Gender Equality", color: "#FF3A21" },
  { number: "06", title: "Clean Water and Sanitation", color: "#26BDE2" },
  { number: "10", title: "Reduced Inequalities", color: "#DD1367" },
  { number: "11", title: "Sustainable Cities and Communities", color: "#FD9D24" },
  { number: "13", title: "Climate Action", color: "#3F7E44" },
];

export function SdgAlignment() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="SDG Alignment"
          heading="Contributing to the Sustainable Development Goals."
          body="TPi's mandate directly supports SDG 1, SDG 11 and SDG 13, with additional contributions to SDGs 3, 4, 5, 6 and 10."
          align="center"
          className="mx-auto mb-16"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sdgs.map((sdg) => (
            <div
              key={sdg.number}
              className="flex items-start gap-4 rounded-2xl bg-soft-bg p-5 transition-transform hover:-translate-y-1"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
                style={{ backgroundColor: sdg.color }}
              >
                {sdg.number}
              </span>
              <div>
                <h3 className="font-semibold text-navy leading-tight">
                  {sdg.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
