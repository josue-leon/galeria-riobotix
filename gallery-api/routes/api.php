<?php

use App\Http\Controllers\Api\V1\ImageController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function() {
    Route::apiResource('images', ImageController::class)->except('update');
    Route::get('images/{id}/download', [ImageController::class, 'download'])->name('images.download');
});
