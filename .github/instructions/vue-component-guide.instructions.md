## Vue/Nuxt Project Guide

Create vue components using the following guidelines
- Always set the `<script/>` block to have the `setup` and `lang="ts"` attributes.
- Place the `<script/>` block above the `<template/>` block.
- Place a single empty line after the `<script>` starting tag.
- Place a single empty line before the `</script>` ending tag.
- Place a single empty line after the `<template>` starting tag.
- Place a single empty line before the `</template>` ending tag.
- Place 3 empty line between the `<script/>` and `<template/>` blocks.
- Use `defineProps` to define component properties.
- Vue reference should be typed unless the `ref()` function parameter is a primitive type.
    - Example:
    ```ts
    // Should not be typed with a generic parameter because the parameter is a primitive type and can be easily inferred.
    const firstName = ref<string>("");

    // It should look like this instead

    const firstName = ref("");

    // This reference will be used for a 'RenamedDialog' vue component.
    // This should be typed because it is referring to Vue component and it is not obvious what the type is
    const dialogRef = ref(null);

    // This is what it should look like
    const dialogRef = ref<InstanceType<typeof RenameDialog> | null>(null);
    ```
- Vue components go into the `components` directory.
  - It is ok to add components to a sub directory inside of the `components` directory.
- API endpoints should be put into the `server/api` directory.
- API endpoint files should be named with the syntax `<name>.<get|post|put|delete|patch>.ts` type of syntax.
  - Examples:
    - `post.get.ts` for a GET request
    - `post.delete.ts` for a DELETE request
- Data model files are placed in the `core/data/models` directory.
  - It is ok to add model files to a sub directory inside of the `core/data/models` directory.
  - Example: Supabase models returned by the supabase client can go into the `core/data/models/supabase` directory
- Composables go into the `composables` directory.

