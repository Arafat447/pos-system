<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;

class POSController extends Controller
{
    public function processSale(Request $request) {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $summary = [];
        $totalPrice = 0;

        foreach ($data['items'] as $item) {
            $product = Products::find($item['product_id']);
            $quantity = $item['quantity'];

            // Validate stock
            if ($product->stock < $quantity) {
                return response()->json([
                    'message' => "Insufficient stock for product: {$product->name}"
                ], 400);
            }

            $price = $product->price * $quantity;
            $offerApplied = null;

            // Check active discount or trade offer
            $now = now();
            if ($product->discount && $product->discount_or_trade_offer_start_date <= $now && $product->discount_or_trade_offer_end_date >= $now) {
                $price -= $price * ($product->discount / 100);
                $offerApplied = "{$product->discount}% discount applied";
            } elseif ($product->trade_offer_min_qty && $quantity >= $product->trade_offer_min_qty) {
                $freeQty = floor($quantity / $product->trade_offer_min_qty) * $product->trade_offer_get_qty;
                $price -= $freeQty * $product->price;
                $offerApplied = "Trade offer applied: Buy {$product->trade_offer_min_qty} Get {$product->trade_offer_get_qty} Free";
            }

            $product->stock -= $quantity;
            $product->save();

            $summary[] = [
                'product' => $product->name,
                'quantity' => $quantity,
                'price' => $price,
                'offer' => $offerApplied,
            ];

            $totalPrice += $price;
        }

        return response()->json([
            'message' => 'Sale processed successfully',
            'summary' => $summary,
            'total_price' => $totalPrice,
        ]);
    }
}
