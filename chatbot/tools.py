import json
import requests
from strands import tool

BASE_URL = "http://localhost:4000"


@tool
def get_products() -> str:
    """Retrieve the full list of products from the Emoji Shop catalog.

    Returns a JSON array of all available products with their id, name, emoji, description, price, and category.
    """
    try:
        response = requests.get(f"{BASE_URL}/api/products")
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not retrieve products (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while retrieving products: {str(e)}"


@tool
def get_product_details(product_id: int) -> str:
    """Retrieve detailed information about a specific product including its reviews.

    Args:
        product_id: The unique identifier of the product to retrieve.
    """
    try:
        response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not retrieve product details (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while retrieving product details: {str(e)}"


@tool
def get_cart() -> str:
    """Retrieve the current shopping cart contents.

    Returns a JSON array of cart items joined with product information including id, product_id, quantity, name, emoji, and price.
    """
    try:
        response = requests.get(f"{BASE_URL}/api/cart")
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not retrieve cart (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while retrieving cart: {str(e)}"


@tool
def add_to_cart(product_id: int, quantity: int) -> str:
    """Add a product to the shopping cart.

    Args:
        product_id: The unique identifier of the product to add.
        quantity: The number of units to add to the cart.
    """
    try:
        response = requests.post(
            f"{BASE_URL}/api/cart",
            json={"product_id": product_id, "quantity": quantity},
        )
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not add item to cart (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while adding to cart: {str(e)}"


@tool
def update_cart_item(cart_item_id: int, quantity: int) -> str:
    """Update the quantity of an item already in the shopping cart.

    Args:
        cart_item_id: The unique identifier of the cart item to update.
        quantity: The new quantity for the cart item.
    """
    try:
        response = requests.put(
            f"{BASE_URL}/api/cart/{cart_item_id}",
            json={"quantity": quantity},
        )
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not update cart item (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while updating cart item: {str(e)}"


@tool
def remove_from_cart(cart_item_id: int) -> str:
    """Remove an item from the shopping cart.

    Args:
        cart_item_id: The unique identifier of the cart item to remove.
    """
    try:
        response = requests.delete(f"{BASE_URL}/api/cart/{cart_item_id}")
        response.raise_for_status()
        return json.dumps(response.json())
    except requests.ConnectionError:
        return "Error: The shop service is currently unavailable. Please try again later."
    except requests.HTTPError as e:
        return f"Error: Could not remove cart item (status {e.response.status_code})"
    except Exception as e:
        return f"Error: An unexpected error occurred while removing cart item: {str(e)}"
