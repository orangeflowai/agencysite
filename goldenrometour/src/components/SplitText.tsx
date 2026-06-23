'use client';

import { CSSProperties, ReactNode } from 'react';

export default function SplitText({ children, className, style }: { children: ReactNode, className?: string, style?: CSSProperties }) {
  if (typeof children !== 'string') {
    return (
      <div
        }
        }
        viewport={{ once: true }}
        }
        className={className}
        style={style}
      >
        {children}
      </div>
    );
  }

  const words = children.split(" ");

  return (
    <div className={`overflow-hidden flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em]">
          <span
            }
            }
            viewport={{ once: true }}
            }
            className="inline-block"
          >
            {word}
          </span>
        </div>
      ))}
    </div>
  );
}
