"use client";
import React from "react";
import Image from "next/image";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <div
        style={{
          animationDuration: props.duration ? `${props.duration}s` : '15s',
        }}
        className="flex flex-col gap-6 pb-6 animate-marquee"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-8 rounded-3xl border border-border bg-card shadow-lg shadow-primary/5 max-w-xs w-full" key={i}>
                  <div className="text-sm leading-relaxed text-muted-foreground italic font-serif">"{text}"</div>
                  <div className="flex items-center gap-3 mt-5">
                    <Image
                      src={image}
                      alt={name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover border border-primary/20"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight leading-5 text-foreground text-sm">{name}</div>
                      <div className="leading-5 text-[8px] opacity-60 tracking-widest uppercase font-mono">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </div>
    </div>
  );
};
