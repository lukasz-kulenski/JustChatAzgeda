import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase.js'
import { ref as dbRef, set, get, onChildAdded, onChildChanged, update } from "firebase/database";
import { ref as vueRef } from 'vue'
import { useUsersStore } from 'src/stores/users'
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

export const useSettingsBetweenUsers = defineStore('settingsBetweenUsers', () => {

    const showSettingsBetweenUsers = vueRef(false)

    const usersStore = useUsersStore()

    const route = useRoute()

    const getMyId = () => {
        return usersStore.userDetails.id
    }

    const getOtherUserId = () => {
        return route.params.otherUserId
    }

    const selectedTheme = vueRef('')
    const firebaseChangeTheme = (payLoad) => {
        selectedTheme.value = payLoad

        const myId = getMyId()
        const otherUserId = getOtherUserId()

        update(dbRef(db, `messages/${myId}/${otherUserId}`), {
            theme: payLoad
        })

        update(dbRef(db, `messages/${otherUserId}/${myId}`), {
            theme: payLoad
        })
    }

    const firebaseGetTheme = () => {
        const myId = getMyId()
        const otherUserId = getOtherUserId()

        onChildAdded(dbRef(db, `messages/${myId}/${otherUserId}`), snapshot => {
            if (snapshot.key == 'theme') {
                selectedTheme.value = snapshot.val()
            }
        })

        onChildChanged(dbRef(db, `messages/${myId}/${otherUserId}`), snapshot => {
            if (snapshot.key == 'theme') {
                selectedTheme.value = snapshot.val()
            }
        })
    }

    return {
        showSettingsBetweenUsers,
        selectedTheme,
        firebaseChangeTheme,
        firebaseGetTheme,
    }
});

