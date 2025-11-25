import sys
import os
import pytest

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

def test_imports():
    """Test that we can import the server modules."""
    try:
        import server
        import search
        import reporting
        import recommendations
    except ImportError as e:
        pytest.fail(f"Failed to import modules: {e}")

def test_reporting_mock_data():
    """Test that the reporting module returns valid mock data."""
    from reporting import get_mock_compliance_data, ComplianceReporter
    
    data = get_mock_compliance_data()
    assert "health_score" in data
    assert data["health_score"] == 92
    
    reporter = ComplianceReporter()
    report = reporter.generate_report(data)
    assert "# Compliance Report" in report
    assert "Executive Summary" in report

def test_search_initialization():
    """Test that SemanticSearch initializes (gracefully handles missing key)."""
    from search import SemanticSearch
    
    # It should not crash even if key is missing (we added try-except)
    search_engine = SemanticSearch(persistence_directory="./test_db")
    assert search_engine is not None
