<template>
    <div class="uploader-drawer-content">
        <div v-if="image" class="uploader-preview-image">
            <img :src="`/assets/${image.filename_disk}`"/>
            <div class="controls">
                <v-button icon rounded @click="() => handleUpload(null)">
                        <v-icon name="close" />
                </v-button>
            </div>
        </div>
        <v-upload
            v-if="!image"
            :from-library="fromLibrary"
            :from-url="fromUrl"
            @input="handleUpload"
        />
    </div>
</template>
<script setup lang="ts">
//TODO: Use file-image interface once its public
import { defineProps, defineEmits, ref } from 'vue';

defineProps({
    fromLibrary: {
        type: Boolean,
        default: false,
    },
    fromUrl: {
        type: Boolean,
        default: false,
    }
});

const image = ref();

const emit = defineEmits(['input']);

const handleUpload = (data) => {
    image.value = data;
    emit('input', data);
}

</script>
<style lang="css" scoped>
.uploader-drawer-content {
	padding: var(--content-padding);
	padding-top: 0;
	padding-bottom: var(--content-padding);
}
.uploader-preview-image {
	margin-bottom: var(--form-vertical-gap);
	background-color: var(--background-normal);
	border-radius: var(--border-radius);
    position:relative;
}
.uploader-preview-image img {
	display: block;
	width: auto;
	max-width: 100%;
	height: auto;
	max-height: 40vh;
	margin: 0 auto;
	object-fit: contain;
}

.controls {
    position: absolute;
	top: var(--content-padding);
	left: var(--content-padding);
}
</style>
