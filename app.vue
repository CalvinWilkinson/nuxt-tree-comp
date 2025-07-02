
<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes2" @node-expand="onNodeExpand2" loadingMode="icon" class="w-full md:w-[30rem]"></Tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode';
import { ref, onMounted } from 'vue';

// const nodes = ref(null);
const nodes2 = ref<TreeNode[] | undefined>(undefined);
const loading = ref(false);

onMounted(() => {
    loading.value = true;
    nodes2.value = initiateNodes2();

    setTimeout(() => {
        // nodes.value = initiateNodes();
        loading.value = false;
        nodes2.value?.map((node) => (node.loading = false));
    }, 2000);
});

const onNodeExpand2 = (node: TreeNode) => {
    if (!node.children) {
        node.loading = true;

        setTimeout(() => {
            let _node = { ...node };

            _node.children = [];

            for (let i = 0; i < 3; i++) {
                _node.children.push({
                    key: node.key + '-' + i,
                    label: 'Lazy ' + node.label + '-' + i
                });
            }

            let _nodes = { ...nodes2.value };

            _nodes[parseInt(node.key, 10)] = { ..._node, loading: false };

            nodes2.value = _nodes;
        }, 500);
    }
};

const initiateNodes2 = (): TreeNode[] => {
    return [
        {
            key: '0',
            label: 'Node 0',
            leaf: false,
            loading: true
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

