'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function LiveVisitorCounter() {
  const [count, setCount] = useState(0);
  const baseCount = 847; // Base number of viewers

  useEffect(() => {
    // Generate a random starting count
    const randomStart = baseCount + Math.floor(Math.random() * 50);
    setCount(randomStart);

    // Update count every 5-10 seconds
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
      setCount((prev) => Math.max(baseCount, Math.min(baseCount + 100, prev + change)));
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      }
      }
      className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-100"
    >
      <div
        }
        }
      >
        <Eye className="w-4 h-4 text-sky-600" />
      </div>
      <div className="flex items-center gap-1">
        
          <span
            key={count}
            }
            }
            }
            }
            className="font-semibold text-gray-900"
          >
            {count}
          </span>
        
        <span className="text-sm text-gray-600">people viewing now</span>
      </div>
    </div>
  );
}
