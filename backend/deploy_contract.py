from solcx import compile_standard, install_solc
from web3 import Web3
import json

# 1) Install compiler
install_solc("0.8.0")

# 2) Read smart contract
with open("./sampleContract.sol", "r") as file:
    contract_source_code = file.read()

# 3) Compile it
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"sampleContract.sol": {"content": contract_source_code}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                }
            }
        },
    },
    solc_version="0.8.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# 4) Extract bytecode + abi
bytecode = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]

# 5) Connect to Ganache
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
chain_id = 1337

# ⚡ Replace with your Ganache account:
my_address = "0x0711179bD08B2A39756456059661E2745FB1d042"
private_key = "0x8b61443a44a09def2df352dff90115b1622d75ac9e05e7341d1ab29dff99b0b4"

# 6) Deploy contract
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)
nonce = w3.eth.get_transaction_count(my_address)

# Build transaction
transaction = SimpleStorage.constructor().build_transaction({
    "chainId": chain_id,
    "from": my_address,
    "nonce": nonce,
    "gasPrice": w3.eth.gas_price,
})

# Sign transaction
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

# Send
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print("✅ Contract deployed at:", tx_receipt.contractAddress)
