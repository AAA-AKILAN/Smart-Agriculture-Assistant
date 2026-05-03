
-- Create a public storage bucket for leaf images
INSERT INTO storage.buckets (id, name, public)
VALUES ('leaf-images', 'leaf-images', true);

-- Allow anyone to upload to the bucket (anonymous uploads for this app)
CREATE POLICY "Allow public uploads to leaf-images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'leaf-images');

-- Allow public read access
CREATE POLICY "Allow public read access to leaf-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'leaf-images');
