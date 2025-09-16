import "../scss/main.scss";
import { Sakura } from "../models/sakura";

document.addEventListener("DOMContentLoaded", () => {
    const sakura = new Sakura(
        document.body.querySelector(".body__container") as HTMLElement,
        {
            spawnInterval: 400,
            maxPetals: 70,
            windStrength: 150,
            windChance: 0.7, // more gusts
        }
    );

    sakura.start();
});
