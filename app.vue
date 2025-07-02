
<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode';
import { ref, onMounted } from 'vue';

const nodes = ref<TreeNode[] | undefined>(undefined);
const isLoading = ref(false);

onMounted(() => {
    isLoading.value = true;
    nodes.value = initiateNodes();

    // Simulate time to load the data
    setTimeout(() => {
        isLoading.value = false;
        nodes.value?.map((node) => (node.loading = false));
    }, 2000);
});

const onNodeExpand = (node: TreeNode) => {
    if (!node.children) {
        node.loading = true;

        // Simulate time to load the child notes
        setTimeout(() => {
            let _node = { ...node };

            _node.children = [];

            for (let i = 0; i < 3; i++) {
                _node.children.push({
                    key: node.key + '-' + i,
                    label: 'Lazy ' + node.label + '-' + i
                });
            }

            if (nodes.value) {
                nodes.value[parseInt(node.key, 10)] = { ..._node, loading: false };
            }
        }, 500);
    }
};

const initiateNodes = (): TreeNode[] => {
    return [
        {
            key: '0',
            label: 'Node 0',
            leaf: false,
            loading: true,
            icon: "pi pi-folder"
        },
        {
            key: '1',
            label: 'Node 1',
            leaf: false,
            loading: true
        },
        {
            key: '2',
            label: 'Node 2',
            leaf: false,
            loading: true
        }
    ];
};
</script>

