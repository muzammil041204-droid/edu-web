import { Plus } from 'lucide-react';
import { useId, useState } from 'react';

// FAQ accordion: one item open at a time, keyboard friendly (real buttons).
export default function Accordion({ items, defaultOpen = 0 }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <li
            key={item.q}
            className={`rounded-2xl border transition-colors ${isOpen ? 'border-forest-200 bg-forest-50' : 'border-line bg-white'}`}
          >
            <h3>
              <button
                type="button"
                id={`${id}-q-${index}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a-${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-[1rem] font-semibold"
              >
                {item.q}
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-white transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a-${index}`}
              role="region"
              aria-labelledby={`${id}-q-${index}`}
              hidden={!isOpen}
              className="px-5 pb-5 leading-relaxed text-muted"
            >
              {item.a}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
