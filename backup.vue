<template>
    <div class="min-h-screen bg-gray-100 p-8">
      <UAlert
        icon="i-heroicons-information-circle"
        title="INFORMATION" 
        description="This is a BETA version of the Security Audit Explorer for Solidity. Only support single file Solidity & Arbitrum Chain." 
        variant="soft"
        color="orange"
      />
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Security Audit Explorer for Solidity</h1>
  
      <!-- Input Form -->
  
      <div class="mb-8 flex justify-center">
        <input
          v-model="newContractAddress"
          type="text"
          placeholder="Enter contract address"
          class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-black"
        />
        <button
          @click="contractStore.addContract(newContractAddress as `0x${string}`)"
          class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Contract
        </button>
      </div>
  
      <!-- Search Form -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search contracts"
          class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-black"
        />
        <button
          @click="contractStore.getContract(1, 10, searchQuery)"
          class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
  
      <!-- Contract Table -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(contract, index) in contractStore.contracts" :key="contract.contractAddress">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ (contractStore.currentPage - 1) * contractStore.limit + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ contract.contractAddress }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ contract.contractName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="contract.score > 50 ? 'text-green-600' : 'text-red-600'">
                {{ contract.score }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ contract.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <UButton
                  @click="openDetails(contract.contractAddress)"
                  color="gray"
                >
                  Details
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="changePage(contractStore.currentPage - 1)"
            :disabled="contractStore.currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            v-for="page in totalFilteredPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
              contractStore.currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(contractStore.currentPage + 1)"
            :disabled="contractStore.currentPage === totalFilteredPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      </div>
  
      <!-- Details Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-black">
          <h2 class="text-2xl font-bold mb-4">Contract Details</h2>
          <form class="space-y-4">
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="address" :value="contractStore.dataDetailContract?.contractAddress" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
            </div>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" :value="contractStore.dataDetailContract?.contractName" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
            </div>
            <div>
              <label for="securityScore" class="block text-sm font-medium text-gray-700">Security Score</label>
              <input type="text" id="securityScore" :value="contractStore.dataDetailContract?.score" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
            </div>
            <div>
              <label for="dateAdded" class="block text-sm font-medium text-gray-700">Date Added</label>
              <input type="text" id="dateAdded" :value="contractStore.dataDetailContract?.date" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm" />
            </div>
          </form>
          <button
            @click="closeModal"
            class="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
      <UNotifications />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useContractStore } from '@/stores/contract';
  
  const contractStore = useContractStore();
  
  const newContractAddress = ref('')
  
  const isModalOpen = ref(false)
  const searchQuery = ref('')
  
  const tableHeaders = ['#', 'Contract Address', 'Contract Name', 'Security Score', 'Date Added', 'Actions'];
  
  onMounted(() => {
    contractStore.getContract(1, 10);
  });
  
  const totalFilteredPages = computed(() => Math.ceil(contractStore.contracts.length / contractStore.limit));
  
  const changePage = (page: number) => {
    contractStore.getContract(page, contractStore.limit, searchQuery.value);
  }
  
  const openDetails = async (contractAddress: any) => {
    try {
      console.log('Opening details for:', contractAddress);
      await contractStore.detailContract(contractAddress);
      isModalOpen.value = true;
    } catch (error) {
      console.error('Failed to fetch contract details:', error);
    }
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
  }
  </script>