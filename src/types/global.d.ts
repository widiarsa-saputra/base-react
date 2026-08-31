// src/types/global.d.ts
import 'react';

declare module 'react' {
    interface VideoHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPictureInPicture?: boolean;
    }
}