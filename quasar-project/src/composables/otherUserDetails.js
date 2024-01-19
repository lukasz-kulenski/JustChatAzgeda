import { useUsersStore } from "src/stores/users";
import { computed } from "vue";
import { useRoute } from "vue-router";

export function useOtherUserDetails() {
    const route = useRoute()
    const store = useUsersStore()
    
    const otherUserDetails = computed(() => {
        const otherUser = store.usersData[route.params.otherUserId]
        return otherUser
    })

    return { otherUserDetails }
}
