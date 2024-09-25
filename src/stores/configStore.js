import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const config = ref({});

    const loadConfig = async () => {
        const response = await fetch('../../scripts/config.json');
        if (response.ok) {
            config.value = await response.json();
        } else {
            console.error('Failed to load config:', response.status);
        }
    };

    return { config, loadConfig };
});
