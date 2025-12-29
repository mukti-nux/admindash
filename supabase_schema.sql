-- Create Product Table
CREATE TABLE product (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    image_url TEXT,
    images JSONB,
    price NUMERIC,
    category TEXT,
    stock INT4 DEFAULT 0,
    rating FLOAT8 DEFAULT 0,
    features JSONB,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Review Table
CREATE TABLE review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES product(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating FLOAT8,
    comment TEXT,
    date DATE DEFAULT CURRENT_DATE,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE review ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow public read for now, adjust as needed)
CREATE POLICY "Allow public read for products" ON product FOR SELECT USING (true);
CREATE POLICY "Allow public read for reviews" ON review FOR SELECT USING (true);
