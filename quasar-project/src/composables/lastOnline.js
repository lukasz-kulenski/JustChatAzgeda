import { formatDistanceToNow } from "date-fns";
import { computed } from 'vue'

export function WhenlastOnline(date) {

    const checkLastOnline = (date) => {
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const lastOnline = computed(() => {
        return checkLastOnline;
    });

    return { lastOnline };
}