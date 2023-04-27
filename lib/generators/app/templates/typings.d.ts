declare module '*.scss' {
    const classes: { [key: string]: string };
    export default classes;
}
declare module '*.png'

declare module '*.gif'

declare module '*.jpeg'

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module '*.json' {
    const value: any;
    export const version: string;
    export default value;
}

declare const BASE_URL: any;
declare const TEST: boolean;