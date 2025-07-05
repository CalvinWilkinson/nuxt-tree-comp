<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";
import type { RenameDialog } from "#components";
import type { MenuItem, MenuItemCommandEvent } from "primevue/menuitem";
import type { FolderItem } from "~/core/data/folder-item";
import type { FileItem } from "~/core/data/file-item";

interface Props {
    label: string,

    item: FolderItem | FileItem,
}

const props = defineProps<Props>();
const renameDialogRef = ref<InstanceType<typeof RenameDialog> | null>(null);

const menu = ref<InstanceType<typeof Menu>>();
const items = ref<MenuItem[]>([
    {
        label: "Options",
        items: [
            {
                label: "Rename",
                icon: "pi pi-pen-to-square",
                command: async (event: MenuItemCommandEvent) => {
                    if (renameDialogRef.value) {
                        renameDialogRef.value.open();
                    }
                }
            },
            {
                label: "Delete",
                icon: "pi pi-trash",
                command: async (event: MenuItemCommandEvent) => {
                    const queryParams = `?filePath=${props.item.path}`;

                    const url = `/api/file${queryParams}`;
                    await $fetch(url, {
                        method: "DELETE",
                    });
                }
            },
        ]
    }
]);

const toggle = (event: MouseEvent) => {
    if (menu.value) {
        menu.value.toggle(event);
    }
};

</script>



<template>
    <div class="flex flex-row justify-center items-center">
        <label class="ml-1">{{ props.label }}</label>
        <Button icon="pi pi-ellipsis-v" variant="text" raised rounded aria-label="Filter" size="small"
            @click="toggle" />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>

    <RenameDialog ref="renameDialogRef" :file="props.item" />
</template>
