-- Create a storage bucket for user uploaded images
INSERT INTO
    storage.buckets (id, name, public)
VALUES
    ('user-images', 'user-images', true);

-- Create RLS policy to allow public read access to user-images bucket
CREATE POLICY "Public Access for user-images" ON storage.objects FOR
SELECT
    USING (bucket_id = 'user-images');

-- Create RLS policy to allow authenticated users to insert into user-images bucket
CREATE POLICY "Allow authenticated users to upload to user-images" ON storage.objects FOR
INSERT
    WITH CHECK (bucket_id = 'user-images');

-- Create a storage bucket for generated images
INSERT INTO
    storage.buckets (id, name, public)
VALUES
    ('generated-images', 'generated-images', true);

-- Create RLS policy to allow public read access to generated-images bucket
CREATE POLICY "Public Access for generated-images" ON storage.objects FOR
SELECT
    USING (bucket_id = 'generated-images');