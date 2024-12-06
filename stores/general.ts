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
    },
    toExplorer(chain: 'ethereum' | 'arbitrum' | 'optimism' | 'base', contractAddress: `0x${string}`) {
      if (chain == 'ethereum') {
        return `https://etherscan.io/address/${contractAddress}`;
      } else if (chain == 'arbitrum') {
        return `https://arbiscan.io/address/${contractAddress}`;
      } else if (chain == 'optimism') {
        return `https://optimistic.etherscan.io/address/${contractAddress}`;
      } else if (chain == 'base') {
        return `https://basescan.org/address/${contractAddress}`;
      }
    }
  }
})
