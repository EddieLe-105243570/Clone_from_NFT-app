from web3 import Web3
import json

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
print("Connected:", w3.is_connected())

# Load ABI from compiled_code.json
with open("./compiled_code.json", "r") as file:
    compiled_sol = json.load(file)

abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]

# Use your deployed contract address
contract_address = "0xe7f0BAcbbfFbA231970b7e357790864c7e56D6b6"

# Load contract
contract = w3.eth.contract(address=contract_address, abi=abi)

# Test: retrieve initial value
print("Initial stored value:", contract.functions.retrieve().call())

# Store a new value
my_address = "0x353d47f9117c3D7aa26605B523b19Ea4E2EbE807"
private_key = "0x7bffe1d7262d98d8161b93c826a8e45f8da7f8536f176d81cf02b1d0ddc12264"
chain_id = 1337

nonce = w3.eth.get_transaction_count(my_address)

txn = contract.functions.store(999).build_transaction({
    "chainId": chain_id,
    "from": my_address,
    "nonce": nonce,
    "gasPrice": w3.eth.gas_price,
})

signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
w3.eth.wait_for_transaction_receipt(tx_hash)

# Retrieve updated value
print("Updated stored value:", contract.functions.retrieve().call())
