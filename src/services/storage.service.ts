import { supabase } from '../lib/supabase';

export const storageService = {
    async uploadAvatar(file: File, bucket: 'teachers-avatars' | 'students-avatars' = 'teachers-avatars'): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            console.error(`Error uploading avatar to ${bucket}:`, uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async deleteAvatar(url: string, bucket: 'teachers-avatars' | 'students-avatars' = 'teachers-avatars'): Promise<void> {
        try {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1];

            const { error } = await supabase.storage
                .from(bucket)
                .remove([fileName]);

            if (error) {
                console.error('Error deleting avatar from storage:', error);
            }
        } catch (err) {
            console.error('Error parsing avatar URL for deletion:', err);
        }
    }
};
