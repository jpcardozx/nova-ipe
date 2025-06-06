import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            svg: React.SVGProps<SVGSVGElement>;
            path: React.SVGProps<SVGPathElement>;
            circle: React.SVGProps<SVGCircleElement>;
        }
    }
}
