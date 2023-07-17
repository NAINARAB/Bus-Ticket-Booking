import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fejnzraorysqrebwyrry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlam56cmFvcnlzcXJlYnd5cnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNDAzMDYsImV4cCI6MjAwNDcxNjMwNn0.0a0agYcuoaxzEp5sQ05VyPziXeuZVnbIKl-8qBEpx_U';
export const supabase = createClient(supabaseUrl, supabaseKey);