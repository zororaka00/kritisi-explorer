<template>
  <UNotifications />
  <UContainer>
    <div class="min-h-screen p-8">
      <UAlert
        icon="i-heroicons-information-circle"
        title="INFORMATION"
        description="This is a BETA version of the Security Audit Explorer for Solidity. Supports single file Solidity contracts across Ethereum, Arbitrum, Base, and Optimism networks."
        variant="soft"
        color="orange"
      />

      <h1 class="text-3xl font-bold mb-8 text-center">Security Audit Explorer for Solidity</h1>

      <div class="mb-8 flex justify-center">
        <UInput
          v-model="newContractAddress"
          placeholder="Input new contract address"
          size="xl"
        />
        <USelect
          v-model="selectedChain"
          :options="chainOptions"
          placeholder="Select chain"
          class="ml-2"
          size="xl"
          :ui="{ width: 'w-40' }"
        />
        <UButton
          @click="contractStore.addContract(newContractAddress as `0x${string}`, selectedChain)"
          class="ml-2"
          :loading="contractStore.isLoadingData"
        >
          Add Contract
        </UButton>
      </div>

      <!-- Search Form -->
      <div class="mb-4 flex">
        <UInput
          v-model="searchQuery"
          placeholder="Search...."
        />
        <UButton
          @click="contractStore.getContract(1, 10, searchQuery)"
          class="ml-2"
          :loading="contractStore.isLoadingData"
        >
          Search
        </UButton>
      </div>

      <!-- Contract Table -->
      <UCard>
        <UTable :columns="tableHeaders" :rows="contractStore.contracts" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        :progress="{ color: 'primary', animation: 'carousel' }" :loading="contractStore.isLoadingData"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
          <template #number-data="{ index }">
            {{ (contractStore.currentPage - 1) * contractStore.limit + index + 1 }}
          </template>
          <template #contractAddress-data="{ row }">
            <a :href="`https://arbiscan.io/address/${row.contractAddress}`" target="_blank">{{ row.contractAddress }}</a>
          </template>
          <template #score-data="{ row }">
            <span :class="row.score > 50 ? 'text-green-600' : 'text-red-600'">
              {{ row.score }} / 100
            </span>
          </template>
          <template #actions-data="{ row }">
            <UButton
              @click="contractStore.detailContract(row.id)"
              variant="solid"
              color="gray"
              :loading="contractStore.isLoadingData"
            >
              Detail
            </UButton>
          </template>
        </UTable>
      </UCard>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <UPagination
          v-model="contractStore.currentPage"
          :total="contractStore.totalData"
          :page-count="contractStore.limit"
          @update:model-value="changePage"
          :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
          :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
          :disabled="contractStore.isLoadingData"
        />
      </div>

      <!-- Details Modal -->
      <UModal v-model="contractStore.isModalOpen">
        <UCard>
          <template #header>
            <h2 class="text-2xl font-bold">Contract Details</h2>
          </template>
          <div class="space-y-4">
            <UFormGroup label="Contract Address">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.contractAddress"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Contract Name">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.contractName"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Contract Creator">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.contractCreator"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Contract Tx Hash">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.contractTxHash"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Security Score">
              <UInput
                color="gray" variant="outline"
                :model-value="`${contractStore.dataDetailContract?.score} / 100`"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Chain">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.chain"
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Result">
              <UTextarea
                color="gray" variant="outline" :rows="10"
                :model-value="JSON.stringify(contractStore.dataDetailContract?.securityObject, null, 2)"
                resize
                readonly
              />
            </UFormGroup>
            <UFormGroup label="Date Added">
              <UInput
                color="gray" variant="outline"
                :model-value="contractStore.dataDetailContract?.date"
                readonly
              />  
            </UFormGroup>
          </div>
          <template #footer>
            <UButton @click="contractStore.isModalOpen = false" block>
              Close
            </UButton>
          </template>
        </UCard>
      </UModal>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useContractStore } from '@/stores/contract';

const contractStore = useContractStore();

const newContractAddress = ref('');
const selectedChain = ref('ARBITRUM');
const chainOptions = [
  { label: 'Ethereum', value: 'ETHEREUM' },
  { label: 'Arbitrum', value: 'ARBITRUM' },
  { label: 'Optimism', value: 'OPTIMISM' },
  { label: 'Base', value: 'BASE' }
];
const searchQuery = ref('');

const tableHeaders = [
  { key: 'number', label: '#' },
  { key: 'contractAddress', label: 'Contract Address' },
  { key: 'contractName', label: 'Contract Name' },
  { key: 'score', label: 'Security Score' },
  { key: 'chain', label: 'Chain' },
  { key: 'date', label: 'Date Added' },
  { key: 'actions', label: 'Actions' }
];

onMounted(() => {
  contractStore.getContract(1, 10)
});

const changePage = (page: number) => {
  contractStore.getContract(page, contractStore.limit, searchQuery.value)
};
</script>
