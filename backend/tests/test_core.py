from datetime import date

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.core.utils import daterange_offset


def test_daterange_offset():
    start = date(2024, 1, 1)
    assert daterange_offset(start, 3) == date(2024, 1, 4)


def test_password_hash_and_verify():
    hashed = hash_password('secret123')
    assert verify_password('secret123', hashed) is True
    assert verify_password('wrong', hashed) is False


def test_token_types():
    access = create_access_token('user-1')
    refresh = create_refresh_token('user-1')

    payload_access = decode_token(access)
    payload_refresh = decode_token(refresh)

    assert payload_access['type'] == 'access'
    assert payload_refresh['type'] == 'refresh'
