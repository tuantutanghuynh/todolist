<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    private array $defaultCategories = [
        ['name' => 'Personal', 'color' => '#3B82F6', 'icon' => 'user'],
        ['name' => 'Work', 'color' => '#EF4444', 'icon' => 'briefcase'],
        ['name' => 'Shopping', 'color' => '#10B981', 'icon' => 'shopping-cart'],
        ['name' => 'Health', 'color' => '#F59E0B', 'icon' => 'heart'],
        ['name' => 'Study', 'color' => '#8B5CF6', 'icon' => 'academic-cap'],
        ['name' => 'Finance', 'color' => '#06B6D4', 'icon' => 'currency-dollar'],
    ];

    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            foreach ($this->defaultCategories as $data) {
                Category::create([
                    'user_id' => $user->id,
                    ...$data,
                ]);
            }
            $this->command->info("✓ Created categories for: {$user->email}");
        }
    }
}