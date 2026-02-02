<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $this->command->error('No user found!');
            return;
        }

        $categories = $user->categories->keyBy('name');

        $todos = [
            // PENDING - Due today
            ['category' => 'Personal', 'title' => 'Call mom', 'priority' => 3, 'due_date' => now()],
            ['category' => 'Work', 'title' => 'Review PRs', 'priority' => 2, 'due_date' => now()],

            // PENDING - Future
            ['category' => 'Work', 'title' => 'Finish report', 'priority' => 3, 'due_date' => now()->addDays(3)],
            ['category' => 'Study', 'title' => 'Laravel course', 'priority' => 3, 'due_date' => now()->addDays(7)],
            ['category' => 'Shopping', 'title' => 'Buy groceries', 'priority' => 2, 'due_date' => now()->addDays(2)],

            // COMPLETED
            ['category' => 'Work', 'title' => 'Submit timesheet', 'priority' => 3, 'due_date' => now()->subDays(2), 'is_completed' => true],
            ['category' => 'Shopping', 'title' => 'Buy birthday gift', 'priority' => 3, 'due_date' => now()->subDay(), 'is_completed' => true],

            // OVERDUE
            ['category' => 'Personal', 'title' => 'Return library books', 'priority' => 1, 'due_date' => now()->subDays(3)],
            ['category' => 'Finance', 'title' => 'File tax documents', 'priority' => 2, 'due_date' => now()->subDays(5)],

            // NO CATEGORY
            ['category' => null, 'title' => 'Random thought', 'priority' => 1, 'due_date' => null],
        ];

        foreach ($todos as $data) {
            Todo::create([
                'user_id' => $user->id,
                'category_id' => $data['category'] ? $categories->get($data['category'])?->id : null,
                'title' => $data['title'],
                'priority' => $data['priority'],
                'due_date' => $data['due_date'],
                'is_completed' => $data['is_completed'] ?? false,
            ]);
        }

        $this->command->info("✓ Created todos for: {$user->email}");
    }
}