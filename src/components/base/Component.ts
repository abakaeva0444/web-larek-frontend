// src/components/base/Component.ts (базовый компонент)

import { EventEmitter } from "./events";

export abstract class Component<T> {
    protected container: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this.container = container;
        this.events = events;
    }

    abstract render(data?: Partial<T>): HTMLElement;

    protected setText(element: HTMLElement, value: string): void {
        if (element) element.textContent = value;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            element.toggleAttribute('disabled', state);
        }
    }
}