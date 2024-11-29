import { defineStore } from 'pinia';
import { isAddress } from 'sol-type-check';

import { useGeneralStore } from './general';

export interface IContract {
  id: number,
  contractAddress: `0x${string}`,
  contractName: string,
  score: number,
  date: string
}

export interface IDetailContract {
  id: number,
  contractAddress: `0x${string}`,
  contractName: string,
  score: number,
  securityObject: string,
  date: string
}

export const useContractStore = defineStore('contract', {
  state: () => ({
    isLoadingData: false,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    contracts: [] as IContract[],
    dataDetailContract: null as IDetailContract | null
  }),
  actions: {
    addContract(contractAddress: `0x${string}`) {
      const general = useGeneralStore();
      if (isAddress(contractAddress)) {
        $fetch(`/api/add`, {
          method: 'POST',
          body: {
            contractAddress
          }
        }).then((res) => {
          if (res.status == 200) {
            general.showToast('success', 'Contract added successfully');
          } else {
            general.showToast('error', res.message);
          }
        }).catch(() => {
          general.showToast('error', 'Internal server error');
        });
      } else {
        general.showToast('error', 'Invalid contract address');
      }
    },
    getContract(page: number, limit: number, search: string | null = null) {
      this.isLoadingData = true;
      const general = useGeneralStore();
      $fetch(`/api/get?page=${page}&limit=${limit}&search=${search ? encodeURIComponent(search) : ''}`)
        .then((res: any) => {
          if (res.status == 200) {
            this.currentPage = res.currentPage;
            this.totalPages = res.totalPages;
            this.contracts = res.data?.length > 0 ? res.data : [];
            this.isLoadingData = false;
          } else {
            general.showToast('error', res.message);
            this.isLoadingData = false;
          }
        }).catch(() => {
          general.showToast('error', 'Internal server error');
          this.isLoadingData = false;
        });
    },
    detailContract(contractAddress: `0x${string}`) {
      const general = useGeneralStore();
      $fetch(`/api/detail?contractAddress=${contractAddress}`)
        .then((res: any) => {
          if (res.status == 200) {
            console.log(res);
            this.dataDetailContract = res.data;
          } else {
            general.showToast('error', res.message);
          }
        }).catch(() => {
          general.showToast('error', 'Internal server error');
        });
    }
  }
});