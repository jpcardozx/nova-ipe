declare module 'pannellum-react' {
    import { ReactNode } from 'react';

    export interface PannellumProps {
        id?: string;
        width?: string;
        height?: string;
        image?: string;
        imageSource?: string;
        equirectangularPath?: string;
        className?: string;
        style?: React.CSSProperties;
        yaw?: number;
        pitch?: number;
        hfov?: number;
        minHfov?: number;
        maxHfov?: number;
        autoLoad?: boolean;
        compass?: boolean;
        draggable?: boolean;
        disableKeyboardCtrl?: boolean;
        preview?: string;
        previewTitle?: string;
        showZoomCtrl?: boolean;
        showFullscreenCtrl?: boolean;
        hotspotDebug?: boolean;
        onLoad?: () => void;
        onMousedown?: (evt: MouseEvent) => void;
        onMouseup?: (evt: MouseEvent) => void;
        onClick?: (evt: MouseEvent) => void;
        onError?: (err: Error) => void;
        children?: ReactNode;
    }

    export class Pannellum extends React.Component<PannellumProps> { }

    export interface PannellumVideoProps {
        id?: string;
        width?: string;
        height?: string;
        video?: string;
        videoSource?: string;
        className?: string;
        style?: React.CSSProperties;
        yaw?: number;
        pitch?: number;
        hfov?: number;
        minHfov?: number;
        maxHfov?: number;
        autoLoad?: boolean;
        compass?: boolean;
        draggable?: boolean;
        disableKeyboardCtrl?: boolean;
        preview?: string;
        previewTitle?: string;
        showZoomCtrl?: boolean;
        showFullscreenCtrl?: boolean;
        hotspotDebug?: boolean;
        onLoad?: () => void;
        onMousedown?: (evt: MouseEvent) => void;
        onMouseup?: (evt: MouseEvent) => void;
        onClick?: (evt: MouseEvent) => void;
        onError?: (err: Error) => void;
        children?: ReactNode;
    }

    export class PannellumVideo extends React.Component<PannellumVideoProps> { }
}
