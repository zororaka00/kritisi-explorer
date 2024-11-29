<template>
  <div class="min-h-screen p-8">
    <UAlert
      icon="i-heroicons-information-circle"
      title="INFORMATION"
      description="This is a BETA version of the Security Audit Explorer for Solidity. Only support single file Solidity & Arbitrum Chain."
      variant="soft"
      color="orange"
    />

    <h1 class="text-3xl font-bold mb-8 text-center">Security Audit Explorer for Solidity</h1>

    <!-- Input Form -->
    <div class="mb-8 flex justify-center">
      <UInput
        v-model="newContractAddress"
        placeholder="Enter contract address"
      />
      <UButton
        @click="contractStore.addContract(newContractAddress as `0x${string}`)"
        class="ml-2"
      >
        Add Contract
      </UButton>
    </div>

    <!-- Search Form -->
    <div class="mb-4 flex">
      <UInput
        v-model="searchQuery"
        placeholder="Search contracts"
      />
      <UButton
        @click="contractStore.getContract(1, 10, searchQuery)"
        class="ml-2"
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
        <template #score-data="{ row }">
          <span :class="row.score > 50 ? 'text-green-600' : 'text-red-600'">
            {{ row.score }}
          </span>
        </template>
        <template #actions-data="{ row }">
          <UButton
            @click="openDetails(row.contractAddress)"
            variant="solid"
            color="gray"
          >
            Details
          </UButton>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <UPagination
        v-model="contractStore.currentPage"
        :total="totalFilteredPages"
        :page-count="5"
        @change="changePage"
      />
    </div>

    <!-- Details Modal -->
    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold">Contract Details</h2>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Address">
            <UInput
              :model-value="contractStore.dataDetailContract?.contractAddress"
              readonly
            />
          </UFormGroup>
          <UFormGroup label="Name">
            <UInput
              :model-value="contractStore.dataDetailContract?.contractName"
              readonly
            />
          </UFormGroup>
          <UFormGroup label="Security Score">
            <UInput
              :model-value="contractStore.dataDetailContract?.score"
              readonly
            />
          </UFormGroup>
          <UFormGroup label="Date Added">
            <UInput
              :model-value="contractStore.dataDetailContract?.date"
              readonly
            />
          </UFormGroup>
        </div>
        <template #footer>
          <UButton @click="closeModal" block>
            Close
          </UButton>
        </template>
      </UCard>
    </UModal>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useContractStore } from '@/stores/contract'

const contractStore = useContractStore()

const newContractAddress = ref('')
const isModalOpen = ref(false)
const searchQuery = ref('')

const tableHeaders = [
  { key: 'number', label: '#' },
  { key: 'contractAddress', label: 'Contract Address' },
  { key: 'contractName', label: 'Contract Name' },
  { key: 'score', label: 'Security Score' },
  { key: 'date', label: 'Date Added' },
  { key: 'actions', label: 'Actions' }
]

onMounted(() => {
  contractStore.getContract(1, 10)
})

const totalFilteredPages = computed(() => Math.ceil(contractStore.contracts.length / contractStore.limit))

const changePage = (page: number) => {
  contractStore.getContract(page, contractStore.limit, searchQuery.value)
}

const openDetails = async (contractAddress: `0x${string}`) => {
  try {
    console.log('Opening details for:', contractAddress)
    await contractStore.detailContract(contractAddress)
    isModalOpen.value = true
  } catch (error) {
    console.error('Failed to fetch contract details:', error)
  }
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

