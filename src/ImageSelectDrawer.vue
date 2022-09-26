<template>
    <v-drawer 
        v-model="active"
        @cancel="cancel"
        title="Configure image"
        icon="image"
    >
        <template #actions>
            <v-button v-tooltip.bottom="t('save')" icon rounded @click="submit">
					<v-icon name="check" />
            </v-button>
        </template>
        <template #default>
            <BasicFileImage from-url from-library @input="(f) => file = f" />
        </template>
    </v-drawer>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi } from '@directus/extensions-sdk';
import BasicFileImage from './components/basic-file-image.vue';

const { t } = useI18n();
const api = useApi();

const file = ref();

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update', 'cancel']);

// We have to reset file and newSize on component activation
// because there is only one instance of this component in editorJs.
watch(() => props.active, value => {
    if(!value){
        file.value = null;
        newSize.value = null;
    }
})

const submit = async () => {
    if(file.value) {
        const completeFile = await getCompleteFile(file.value);
        emit('update', completeFile);
    } else {
        cancel();
    }
}

const cancel = () => {
    emit('cancel');
};

// Get file again, so that rokka hash is available
const getCompleteFile = async (file) => {
    const fileResponse = await api.get(`/files/${file.id}`);
    const fileData = fileResponse.data.data;
    return fileData;
};

</script>