<script setup>
import { ref, reactive, onMounted, inject, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import { useGlobalStore } from '../stores/useGlobalStore';

const fetch = inject('fetch');
const globalStore = useGlobalStore();

const initialState = {
  q: '',
  p: 1,
  sortBy: 'name',
  pageSize: 10,
  sort: 'asc'
};

const rules = {
  q: {
    minLength: minLength(2),
    maxLength: maxLength(100)
  }
};

const state = reactive({
  ...initialState,
});

const v$ = useVuelidate(rules, state);

const loading = ref(false);
const currentPage = ref(1);
const products = ref([]);
const totalCount = ref(0);
const currentPageSize = ref(20);

const headers = reactive([
  { key: 'name', title: '商品名稱', sort: 'asc' },
  { key: 'price', title: '價格', sort: 'asc' },
  { key: 'stock', title: '庫存', sort: 'asc' },
  { key: 'total', title: '總價值', sortable: false }
]);

const pageCount = computed(() => Math.ceil(totalCount.value / state.pageSize));

const setProducts = (value) => {
  if (!value) return;
  products.value = value.map((item) => {
    item.total = item.stock * item.price;
    return item;
  });
};

const formatPrice = (price) => price && `$${price.toLocaleString('en-US')}` || '';

const toggleSort = async ({ key }) => {
  if (state.sortBy === key) {
    state.sort = state.sort === 'asc' ? 'desc' : 'asc';
    headers.forEach(header => {
      if (header.key === key) {
        header.sort = state.sort;
      }
    });
  } else {
    currentPage.value = 1;
    state.p = 1;
    headers.forEach(header => {
      if (header.key === key) {
        header.sort = 'asc';
        state.sort = header.sort;
        state.sortBy = key;
      }
    });
  }
  await fetchProducts();
};

let queryChangeTimer = null;
const onQueryChange = () => {
  if (queryChangeTimer) clearTimeout(queryChangeTimer);
  queryChangeTimer = setTimeout(async () => {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    await fetchProducts();
  }, 300);
};

const onPageChange = async (page) => {
  state.p = page;
  await fetchProducts();
};

const onPageSizeChange = async (pageSize) => {
  state.pageSize = pageSize;
  await fetchProducts();
};

const fetchProducts = async () => {
  try {
    let params = {
      p: state.p,
      sort_by: state.sortBy,
      order_by: state.sort,
      page_size: state.pageSize
    };

    if (state.q) {
      params.q = state.q;
    }
    let url = '/products?' + new URLSearchParams(params).toString();
    loading.value = true;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${globalStore.authorizationToken ?? ''}`
      }
    });
    if (res?.products) {
      totalCount.value = res.total;
      setProducts(res.products);
    }
  } catch (error) {

  } finally {
    loading.value = false;
  }
};


onMounted(async () => {
  await fetchProducts();
});



</script>

<template>
  <v-card flat>
    <v-card-text>
      <form>
        <v-text-field
          v-model="state.q"
          :error-messages="v$.q.$errors.map(e => e.$message)"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          single-line
          placeholder="搜尋商品名稱"
          @blur="onQueryChange"
          @input="onQueryChange"
          clearable
        />
      </form>
    </v-card-text>
    <v-table fixed-header height="600px">
      <thead>
        <tr>
          <th class="text-left" v-for="item in headers" :key="item.key">
            <div @click.prevent="() => toggleSort(item)">{{ item.title }}
              <v-icon v-if="item.key !== 'total'" :icon="item.sort === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"/>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>
            <div :class="item.stock < 10 ? 'text-red-lighten-1' : ''">
              {{ item.stock }} <span v-show="item.stock < 10" class="text-red-lighten-1">(低庫存)</span>
            </div>
          </td>
          <td>{{ formatPrice(item.total) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-card-actions class="d-flex">
      <div>
        <v-select v-model="currentPageSize" :items="[10, 20, 40]" variant="outlined" single-line hide-details @update:modelValue="onPageSizeChange" />
      </div>
      <div>
        <v-pagination v-model="currentPage" :total-visible="pageCount / 2" :length="pageCount" @update:modelValue="onPageChange" />
      </div>
    </v-card-actions>
  </v-card>
</template>