import { defineStore } from 'pinia';
import { isAddress } from 'sol-type-check';

import { useGeneralStore } from './general';
import type { IContract, IDetailContract } from '@/types';

export const useContractStore = defineStore('contract', {
  state: () => ({
    isModalOpen: false,
    isLoadingData: false,
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
    limit: 10,
    contracts: [] as IContract[],
    dataDetailContract: null as IDetailContract | null
  }),
  actions: {
    addContract(contractAddress: `0x${string}`, chain: string) {
      this.isLoadingData = true;
      const general = useGeneralStore();
      if (isAddress(contractAddress)) {
        $fetch(`/api/add`, {
          method: 'POST',
          body: {
            contractAddress,
            chain: chain.toUpperCase()
          }
        }).then((res) => {
          if (res.status == 200) {
            general.showToast('success', 'Contract added successfully and queued for audit');
            this.isLoadingData = false;
          } else {
            general.showToast('error', res.message);
            this.isLoadingData = false;
          }
        }).catch((err) => {
          general.showToast('error', err.message);
          this.isLoadingData = false;
        });
      } else {
        general.showToast('error', 'Invalid contract address');
        this.isLoadingData = false;
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
            this.totalData = res.totalData;
            this.contracts = res.data?.length > 0 ? res.data.map((data: any) => ({
              ...data,
              chain: general.capitalizeEachWord(data.chain),
              date: general.dateToLocale(data.date)
            })) : [];
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
    detailContract(id: number) {
      this.isLoadingData = true;
      const general = useGeneralStore();
      $fetch(`/api/detail?id=${id}`)
        .then((res: any) => {
          if (res.status == 200) {
            this.dataDetailContract = {
              ...res.data,
              date: general.dateToLocale(res.data.date),
              chain: general.capitalizeEachWord(res.data.chain)
            };
            this.isModalOpen = true;
            this.isLoadingData = false;
          } else {
            general.showToast('error', res.message);
            this.isLoadingData = false;
          }
        }).catch(() => {
          general.showToast('error', 'Internal server error');
          this.isLoadingData = false;
        });
    }
  }
});