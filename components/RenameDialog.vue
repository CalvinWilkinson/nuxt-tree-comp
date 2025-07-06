<script setup lang="ts">

import { ref, defineExpose, computed } from "vue";
import type { FileItem } from "~/core/data/file-item";
import type { FolderItem } from "~/core/data/folder-item";
import { isFolderItem } from "~/core/utils/type-guards";

interface Props {
    file: FolderItem | FileItem;
    onRenameSuccess?: (oldPath: string, newPath: string) => void;
}

const props = defineProps<Props>();

const visible = ref(false);
const newName = ref<string>("");
const isRenameBtnDisabled = ref(true);
const confirm = useConfirm();
const toast = useToast();

// Computed property to determine if we're renaming a folder or file
const itemType = computed(() => {
    return isFolderItem(props.file) ? "folder" : "file";
});

// Expose methods to control the dialog's visibility
defineExpose({
    open: () => {
        visible.value = true;
    }
});

const confirmRename = (event: MouseEvent) => {
    confirm.require({
        target: event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined,
        header: "Confirm Rename",
        message: `Are you sure you want to rename the ${itemType.value} from '${props.file.name}' to '${newName.value}'?`,
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
            label: "Cancel",
            severity: "secondary",
            outlined: true
        },
        acceptProps: {
            label: "Rename"
        },
        accept: async () => {
            toast.add({ severity: "info", summary: "Confirmed", detail: `${itemType.value} renamed`, life: 3000 });

            const queryParams = `?oldPath=${props.file.path}&newName=${newName.value}`;
            const url = `/api/rename${queryParams}`;

            await $fetch(url, {
                method: "PATCH",
            });

            // Calculate the new path
            const pathParts = props.file.path.split("/");
            pathParts[pathParts.length - 1] = newName.value;
            const newPath = pathParts.join("/");

            // Call the success callback if provided
            if (props.onRenameSuccess) {
                props.onRenameSuccess(props.file.path, newPath);
            }

            visible.value = false;
        }
    });
};

const handleRename = (event: MouseEvent) => {
    confirmRename(event);
};

const handleNameChange = (value: string | undefined) => {
    isRenameBtnDisabled.value = value === undefined || value.trim() === "";
};

</script>



<template>
    <div class="card flex justify-center">
        <Dialog v-model:visible="visible" modal header="Rename Item" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">
                Rename {{ itemType }} <span class="text-blue-500">{{ props.file.name }}</span>
            </span>

            <div class="flex items-center gap-4 mb-8">
                <label for="newName" class="font-semibold w-24">New Name</label>
                <InputText id="newName" class="flex-auto" autocomplete="off" v-model:model-value="newName" @value-change="handleNameChange"/>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Rename" @click="handleRename" :disabled="isRenameBtnDisabled"/>
            </div>
        </Dialog>
    </div>
</template>
