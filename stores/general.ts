import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    isNotificationVisible: false
  }),
  actions: {
    dateToLocale(date: string) {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    showToast(type: 'success' | 'error' | 'info', message: string) {
      this.isNotificationVisible = true;
      const toast = useToast();
      toast.add({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: message,
        icon: type == 'success' ? 'i-heroicons-check-circle' : type == 'error' ? 'i-heroicons-exclamation-circle' : 'i-heroicons-information-circle',
        color: type == 'success' ? 'green' : type == 'error' ? 'red' : 'blue',
        timeout: 3000,
        callback: () => {
          this.isNotificationVisible = false;
        }
      });
    },
    capitalizeEachWord(str: string) {
      return str
          .toLowerCase() 
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }
})
