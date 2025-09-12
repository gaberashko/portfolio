// src/effects/sakura.ts
import { gsap } from "gsap";

const MIN_FALL_HEIGHT: number = 1280;

export interface SakuraOptions {
    colors?: string[];
    sizeRange?: [number, number];
    fallDuration?: [number, number];
    spawnInterval?: number;
    maxPetals?: number;
    windStrength?: number; // max horizontal sway in px
    windChance?: number; // 0–1, probability of gust per petal
}

export class Sakura {
    private options: Required<SakuraOptions>;
    private container: HTMLElement;
    private petalCount = 0;
    private intervalId: number | null = null;

    constructor(
        container: HTMLElement = document.body,
        options: SakuraOptions = {}
    ) {
        this.container = container;

        this.options = {
            colors: options.colors ?? ["#FFB7C5", "#FF69B4", "#F5F5F5"],
            sizeRange: options.sizeRange ?? [8, 20],
            fallDuration: options.fallDuration ?? [13, 18],
            spawnInterval: options.spawnInterval ?? 500,
            maxPetals: options.maxPetals ?? 40,
            windStrength: options.windStrength ?? 100,
            windChance: options.windChance ?? 0.6,
        };
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = window.setInterval(() => {
            if (this.petalCount < this.options.maxPetals) {
                this.spawnPetal();
            }
        }, this.options.spawnInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private spawnPetal() {
        const petal = document.createElement("div");
        petal.classList.add("sakura-petal");

        const size =
            Math.random() *
                (this.options.sizeRange[1] - this.options.sizeRange[0]) +
            this.options.sizeRange[0];
        const color =
            this.options.colors[
                Math.floor(Math.random() * this.options.colors.length)
            ];

        Object.assign(petal.style, {
            position: "fixed",
            top: "-20px",
            left: `${Math.random() * 100}vw`,
            width: `${size}px`,
            height: `${size * 0.8}px`,
            background: color,
            borderRadius: "50% 50% 50% 50%",
            pointerEvents: "none",
            zIndex: "-1",
            opacity: "0.9",
        });

        this.container.appendChild(petal);
        this.petalCount++;

        const fallTime =
            Math.random() *
                (this.options.fallDuration[1] - this.options.fallDuration[0]) +
            this.options.fallDuration[0];

        // Base fall animation
        const timeline = gsap.timeline({
            onComplete: () => {
                petal.remove();
                this.petalCount--;
            },
        });

        timeline.to(petal, {
            y: Math.max(MIN_FALL_HEIGHT, window.innerHeight + 40),
            duration: fallTime,
            ease: "linear",
        });

        // Occasionally add a wind gust
        if (Math.random() < this.options.windChance) {
            const gustStrength =
                Math.random() *
                this.options.windStrength *
                (Math.random() > 0.5 ? 1 : -1);

            timeline.to(
                petal,
                {
                    x: `+=${gustStrength}`,
                    rotation: `+=${90 * Math.sign(gustStrength)}`,
                    duration: fallTime * 0.9,
                    ease: "sine.inOut",
                },
                0 // start at same time as fall
            );
        }
    }
}
